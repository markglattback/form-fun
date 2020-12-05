import { SliderWrapper } from "./styles";
import { SliderProps } from "./types";

export default function CheckBoxSlider({ label, field, form, ...props }: SliderProps) {
  return (
    <SliderWrapper>
      <label>
        <div className="label">{label}</div>
        <div className="slider-container">
          <input type="checkbox" {...field} />
          <span className="slider-background" aria-hidden="true">
          </span>
        </div>
      </label>
    </SliderWrapper>
  )
}