"use client";

import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useTheme } from "next-themes";
interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSave?: () => void;
  showSaveButton?: boolean;
  isEditable?: boolean;
}

const Editor = forwardRef<HTMLDivElement, EditorProps>(
  ({ value, onChange, onSave, showSaveButton = false, isEditable }, ref) => {
    const editor = useCreateBlockNote({
      initialContent: value ? JSON.parse(value) : undefined,
      domAttributes: {
        editor: {
          class: "min-h-[250px] p-4",
          editable: isEditable ? "true" : "false",
        },
      },
    });
    const theme = useTheme();

    editor.onEditorContentChange(() => {
      onChange(JSON.stringify(editor.topLevelBlocks));
    });

    return (
      <div className="space-y-2">
        <div className="overflow-hidden" ref={ref}>
          <BlockNoteView
            editor={editor}
            theme={theme.theme === "dark" ? "dark" : "light"}
            editable={isEditable}
          />
        </div>
        {showSaveButton && (
          <div className="flex justify-end">
            <Button onClick={onSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        )}
      </div>
    );
  }
);

Editor.displayName = "BlockNoteEditor";

export default Editor;
