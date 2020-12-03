import styled from "styled-components";

export default styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  div.reset-icon {
    display: flex;
    place-content: center;
    margin-right: 0.5rem;
  }

  div.error-icon {
    display: flex;
    place-content: center;
    margin-right: 0.5rem;
    border-radius: 50%;
    background-image: url(/error.svg);
    background-repeat: no-repeat;
    width: 1.5rem;
    height: 1.5rem;
    font-weight: 600;

  }
`;