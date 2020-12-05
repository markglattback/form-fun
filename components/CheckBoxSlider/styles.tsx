import styled from "styled-components";

export const SliderWrapper = styled.div`
  width: fit-content;
  margin-top: 1rem;
  
  label {
    display: grid;
    grid-template-columns: auto min-content;
  }

  div.label {
    color: var(--grey700);  
    margin-right: 3rem;
    transform: translateY(0.125em);
  }

  div.slider-container {
    display: grid;
    grid-template-areas: "checkbox";

    > * {
      grid-area: checkbox;
    }

    input {
      opacity: 0;
      width: 3rem;
      height: 1.5rem;
      margin: 0;
      cursor: pointer;

      &:checked + span.slider-background {
      background-color: var(--primary400);
        transition: 0.15s ease-in-out;
      }

      &:checked + span.slider-background:before {
        transform: translateX(0.75rem);
      }

      &:focus + span.slider-background {
        background-color: var(--grey300); 
        box-shadow: 0 0 0 0.0625rem var(--white), 0 0 0.25rem 0.0625rem var(--grey400);
      }

      &:focus + span.slider-background:before {
        box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.15);
      }

      &:focus:checked + span.slider-background {
        background-color: var(--primary);
        box-shadow: 0 0 0 0.0625rem var(--white), 0 0 0.25rem 0.0625rem var(--primary);
      }
    }


  }

  span.slider-background {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    background-color: var(--grey200);
    width: 3rem;
    height: 1.5rem;
    border-radius: 0.75rem;
    pointer-events: none;
    transition: 0.15s ease-in-out;

    &:before {
      content: "";
      background: var(--white);
      position: relative;
      z-index: 10;
      border-radius: 50%;
      width: 1rem;
      height: 1rem;
      transition: 0.15s ease-in-out;
      transform: translateX(-0.75rem);
    }
  }
`;