import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRequest } from 'ahooks';
import { Divider, Button, message, Input } from 'antd';
import { BASE_URL } from '@/utils/request';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor, IEditorConfig } from '@wangeditor/editor';
import '@wangeditor/editor/dist/css/style.css';
import { createInspectionConfig, getInspectionConfig, saveInspectionConfig } from './service';

const Footer = styled.footer`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  background: #f0f2f5;
`;

const IndependentPageConfig = () => {
  const [editor, setEditor] = useState<IDomEditor | null>(null);
  const [html, setHtml] = useState('');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [id, setId] = useState('');

  const { loading, run } = useRequest(getInspectionConfig, {
    manual: true,
    onSuccess: async ({ success, data }) => {
      if (!success) return;
      if (data) {
        if (data.title) {
          setTitle(data.title);
        }
        if (data.price) {
          setPrice(data.price);
        }
        if (data.content) {
          setHtml(data.content);
        }
        if (data.id) {
          setId(data.id);
        }
      }else{
        // 创建新配置
        const { success } = await createInspectionConfig({
          title: '',
          price: '',
          content: '',
        });
        if (success) {
          // 创建成功后重新获取配置
          run();
        }
      }
    },
  });

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        server: `${BASE_URL}/upload`,
        fieldName: 'file',
        maxFileSize: 5 * 1024 * 1024, // 5M
        allowedFileTypes: ['image/*'],
        metaWithUrl: true,
        withCredentials: false,
        // 自定义插入图片逻辑，适配后端返回格式
        customInsert(res: any, insertFn: any) {
          // 后端返回格式: { success: true, data: { url: "xxx" } }
          // wangeditor期望格式: { errno: 0, data: { url: "xxx" } }
          if (res.success && res.data?.url) {
            insertFn(res.data.url, res.data.name || '', res.data.url);
          } else {
            message.error('图片上传失败：返回格式错误');
          }
        },
        onFailed(file: File) {
          message.error(`${file.name} 上传失败`);
        },
        onError(file: File) {
          message.error(`${file.name} 上传出错`);
        },
      },
    },
  };

  // 工具栏配置
  const toolbarConfig = {
    toolbarKeys: [
      'headerSelect',
      'bold',
      'italic',
      'underline',
      'through',
      'code',
      'clearStyle',
      'divider',
      'color',
      'bgColor',
      'fontSize',
      'fontFamily',
      'lineHeight',
      'divider',
      'bulletedList',
      'numberedList',
      'todo',
      'justifyLeft',
      'justifyCenter',
      'justifyRight',
      'justifyJustify',
      'indent',
      'delIndent',
      'divider',
      'insertLink',
      'uploadImage',
      'codeBlock',
      'divider',
      'undo',
      'redo',
    ],
  };

  // 保存
  const handleFinish = async () => {
    // 验证标题
    if (!title.trim()) {
      message.error('标题不能为空');
      return;
    }

    // 验证价格
    if (!price.trim()) {
      message.error('价格不能为空');
      return;
    }

    // 验证价格格式和位数
    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      message.error('价格必须是大于0的数字');
      return;
    }

    if (priceNum >= 10000000000) {
      // 10位数的限制（10000000000是10位数）
      message.error('价格不能超过10位数字');
      return;
    }

    const { success } = await saveInspectionConfig(id, {
      title: title.trim(),
      price: priceNum.toFixed(2),
      content: html,
    });

    if (!success) return;
    message.success('保存成功');
    run();
  };

  // 及时销毁编辑器
  useEffect(() => {
    return () => {
      if (editor === null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  useEffect(() => {
    run();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <Divider orientation="left">独立页面配置管理</Divider>

      <div
        style={{
          display: 'flex',
          gap: '24px',
          minHeight: '800px',
          paddingLeft: '24px',
        }}
      >
        {/* 左侧配置区域 */}
        <div
          style={{
            width: '300px',
            flexShrink: 0,
            padding: '16px',
            backgroundColor: '#fafafa',
            borderRadius: '6px',
            border: '1px solid #d9d9d9',
          }}
        >
          <h4
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            页面配置
          </h4>

          {/* 标题配置 */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#666',
              }}
            >
              标题：
            </label>
            <Input
              placeholder="请输入标题（必填）"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={10}
              showCount
              required
            />
          </div>

          {/* 价格配置 */}
          <div style={{ marginBottom: '16px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                color: '#666',
              }}
            >
              价格：
            </label>
            <Input
              placeholder="请输入价格（必填）"
              value={price}
              onChange={(e) => {
                const value = e.target.value;
                // 只允许数字和小数点，且最多两位小数
                // 同时限制整数部分不超过10位
                if (value === '' || /^\d{0,10}(\.\d{0,2})?$/.test(value)) {
                  setPrice(value);
                }
              }}
              onBlur={() => {
                // 失焦时格式化为两位小数
                if (price && !isNaN(Number(price))) {
                  setPrice(Number(price).toFixed(2));
                }
              }}
              maxLength={13} // 10位整数 + 1位小数点 + 2位小数
              required
            />
          </div>
        </div>

        {/* 中间富文本编辑器区域 */}
        <div
          style={{
            flex: 1,
            maxWidth: '375px', // 小程序标准宽度
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          <Toolbar
            editor={editor}
            defaultConfig={toolbarConfig}
            mode="default"
            style={{
              borderBottom: '1px solid #d9d9d9',
              backgroundColor: '#fafafa',
            }}
          />
          <Editor
            defaultConfig={editorConfig}
            value={html}
            onCreated={setEditor}
            onChange={(editor: IDomEditor) => setHtml(editor.getHtml())}
            mode="default"
            style={{
              height: '800px',
              backgroundColor: '#fff',
              fontSize: '14px',
              lineHeight: '1.5',
            }}
          />
        </div>
      </div>

      <Footer>
        <Button type="primary" onClick={handleFinish} loading={loading}>
          保存
        </Button>
      </Footer>
    </div>
  );
};

export default IndependentPageConfig;
