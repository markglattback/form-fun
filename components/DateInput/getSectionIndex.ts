import { DateSectionName } from "./types";

 export default function getSectionIndex(section: DateSectionName, sectionOrder: DateSectionName[]): number {
    return sectionOrder.indexOf(section);
};