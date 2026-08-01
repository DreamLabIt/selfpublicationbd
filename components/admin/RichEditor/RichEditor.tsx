'use client';

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Dynamic Import-এর সময় Type Mismatch সমাধান করতে ReactQuill-কে Wrapt করা হয়েছে
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill-new");
        return function QuillWrapper(props: React.ComponentProps<typeof RQ>) {
            return <RQ {...props} />;
        };
    },
    {
        ssr: false,
        loading: () => (
            <div className="h-40 w-full bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-400">
                এডিটর লোড হচ্ছে...
            </div>
        ),
    }
);

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["link", "blockquote", "code-block"],
        [{ align: [] }],
        ["clean"],
    ],
};

const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "color",
    "background",
    "link",
    "blockquote",
    "code-block",
    "align",
];

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichEditor({
    value,
    onChange,
    placeholder = "লিখুন...",
}: RichEditorProps) {
    return (
        <div className="rich-editor bg-white rounded-lg overflow-hidden border border-brand-light">
            <ReactQuill
                theme="snow"
                value={value || ""}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
            />
        </div>
    );
}