import { StyledResetButton } from "styles/StyledResetButton";


export default function ResetButton (props: React.SVGProps<SVGAElement>) {
  return (
    <StyledResetButton
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      height="1.25rem"
      width="1.25rem"
    >
      <line x1="6" y1="6" x2="14" y2="14" />
      <line x1="6" y1="14" x2="14" y2="6" />
    </StyledResetButton>
  )
}