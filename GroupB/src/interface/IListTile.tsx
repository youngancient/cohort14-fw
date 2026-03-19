export interface ListTileProps {
  title: string;
  tag: "VIEW" | "WRITE";
  isExpanded: boolean;
  onToggle: () => void;
  placeholders: string[] | null;
  onCall?: (inputs: string[]) => void;
}
