import { css } from 'emotion';

export const Host = css`
  button {
    position: relative;
    width: 100%;
    border-radius: 4px;
    margin-bottom: 10px;
    cursor: pointer;
    padding: 0;
    color: var(--deepSquidInk);
    font-size: 14px;
    box-sizing: content-box;

    &:hover {
      opacity: 0.8;
    }
  }

  &.facebook button {
    background-color: #4267b2;
    border-color: #4267b2;
    font-family: 'Helvetica Neue';
    color: var(--white);
  }

  &.google button {
    background-color: #4285f4;
    font-family: Roboto;
    border: 1px solid #4285f4;
    color: var(--white);
  }

  .icon {
    position: absolute;
    left: 0;
  }

  &.facebook .icon {
    height: 33px;
    width: 18px;
    padding: 10px 14px;
  }

  &.google .icon {
    background-color: var(--white);
    border-radius: 4px 0 0 4px;
    height: 28px;
    width: 28px;
    padding: 12px;
  }

  .content {
    text-align: center;
    display: block;
    padding: 18px 0;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }
`;
