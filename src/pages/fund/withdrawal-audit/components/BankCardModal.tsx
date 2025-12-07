import React, { useImperativeHandle, forwardRef, useState } from 'react';
import { useBoolean } from 'ahooks';
import { Modal, Descriptions } from 'antd';

const BankCardModal = (props: any, ref: any) => {
  const [visible, { setTrue, setFalse }] = useBoolean(false);
  const [bankCard, setBankCard] = useState<any>(null);

  // 打开弹窗方法
  const handleOpenModal = (bankCardData: any) => {
    setBankCard(bankCardData);
    setTrue();
  };

  // 暴露子组件方法
  useImperativeHandle(ref as any, () => {
    return {
      handleOpenModal,
    };
  });

  const handleClose = () => {
    setFalse();
    setBankCard(null);
  };

  return (
    <Modal
      title="银行卡信息"
      open={visible}
      onCancel={handleClose}
      width={600}
      footer={false}
    >
      {bankCard && (
        <Descriptions column={1}>
          <Descriptions.Item label="银行">
            {bankCard.bank_name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="卡号">
            {bankCard.card_number || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="开户行">
            {bankCard.bank_branch || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="持卡人">
            {bankCard.name || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机">
            {bankCard.phone || '-'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default forwardRef(BankCardModal);
