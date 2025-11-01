import React from 'react';
import styled from 'styled-components';
import { SearchOutlined } from '@ant-design/icons';
import { theme } from '@/styles/theme';

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

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索功能、订单、用户...',
  onSearch,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
      />
      <SearchIcon>
        <SearchOutlined />
      </SearchIcon>
    </SearchContainer>
  );
};

export default SearchBar;
