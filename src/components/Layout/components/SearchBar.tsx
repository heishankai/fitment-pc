import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@umijs/max';
import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';
import { theme } from '@/styles/theme';
import { searchRoutes, RouteItem } from '@/utils/route';

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 16px 0 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.08);
  color: ${theme.colors.white};
  font-size: 14px;
  backdrop-filter: blur(10px);
  transition: ${theme.transitions.normal};
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  pointer-events: none;
  transition: color 0.3s ease;

  ${SearchInput}:focus + & {
    color: rgba(255, 255, 255, 0.8);
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SearchResultItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  transition: ${theme.transitions.fast};
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ResultName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
`;

const ResultPath = styled.div`
  font-size: 12px;
  color: #999;
`;

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索页面名称',
  onSearch,
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<RouteItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);

    if (value.trim()) {
      const searchResults = searchRoutes(value);
      setResults(searchResults);
      setShowResults(searchResults.length > 0);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleResultClick = (route: RouteItem) => {
    navigate(route.fullPath);
    setSearchValue('');
    setResults([]);
    setShowResults(false);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // 延迟隐藏，以便点击结果项时能触发
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);

  return (
    <SearchContainer ref={containerRef}>
      <SearchInput
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      <SearchIcon>
        <SearchOutlined />
      </SearchIcon>
      {showResults && results.length > 0 && (
        <SearchResults>
          {results.map((route, index) => (
            <SearchResultItem
              key={index}
              onClick={() => handleResultClick(route)}
              onMouseDown={(e) => e.preventDefault()} // 防止 blur 事件
            >
              <ResultName>{route.name}</ResultName>
              {route.parentName && (
                <ResultPath>
                  {route.parentName} / {route.path}
                </ResultPath>
              )}
            </SearchResultItem>
          ))}
        </SearchResults>
      )}
    </SearchContainer>
  );
};

export default SearchBar;
