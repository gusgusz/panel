import React from "react";
import { Editor } from "@tinymce/tinymce-react";

/**
var suggestions = [
  { text: "Nome do participante", value: "name" },
  { text: "Nº do processo", value: "code" },
];
 */

export default function EditorTiny({ initialValues, onChangeValue, suggestions, height = 500 }) {
  const editorRef = React.useRef(null);

  return (
    <>
      <Editor
        apiKey="66b0kchabt3vlsouyh2b3jd4l3419xijwvb986rrcw2yytve"
        onInit={(evt, editor) => {
          editorRef.current = editor;

          if (suggestions && Array.isArray(suggestions) && suggestions.length > 0) {
            var onAction = function (autocompleteApi, rng, value) {
              editor.selection.setRng(rng);
              editor.insertContent(value);
              autocompleteApi.hide();
            };

            var getMatchedChars = function (pattern) {
              return suggestions.filter(function (char) {
                return char.text.indexOf(pattern) !== -1;
              });
            };

            /* An autocompleter that allows you to insert special characters */
            editor.ui.registry.addAutocompleter("specialchars", {
              ch: "{",
              minChars: 0,
              columns: 1,
              onAction: onAction,
              fetch: async function (pattern) {
                var results = await getMatchedChars(pattern).map(function (char) {
                  return {
                    type: "cardmenuitem",
                    value: `{{${char.value}}}`,
                    label: char.text,
                    items: [
                      {
                        type: "cardcontainer",
                        direction: "vertical",
                        items: [
                          {
                            type: "cardtext",
                            text: char.text,
                            name: "char_name",
                          },
                        ],
                      },
                    ],
                  };
                });

                return results;
              },
            });
          }
        }}
        initialValue={initialValues}
        onEditorChange={onChangeValue}
        init={{
          width: "100%",
          height: height,
          language: "pt_BR",
          menubar: true,
          inline_styles: true,
          plugins: [
            // "export",
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
            // "save",
            "pagebreak",
            // "export",
            "pagebreak",
            "code",
            "emoticons",
            "image",
            "table",
            "paste",
            "lists",
            "advlist",
            // "checklist",
            "link",
            "hr",
            "charmap",
            "directionality",
          ],
          toolbar_mode: "sliding",
          toolbar:
            "export pagebreak fullscreen | formatselect fontselect fontsizeselect bold italic underline strikethrough forecolor backcolor subscript superscript | alignleft aligncenter alignright alignjustify indent outdent rtl ltr | bullist numlist checklist | emoticons image table link hr charmap",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      {/* <button onClick={log}>Log editor content</button> */}
    </>
  );
}
