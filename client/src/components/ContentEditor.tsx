import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import Loading from './Loading';
import { licenseKey } from '../constants';

interface ContentEditorProps {
  onChange: (value: string) => void;
  value: string;
}

export default function ContentEditor({ onChange, value }: ContentEditorProps) {
  const cloud = useCKEditorCloud({
    version: '44.2.0',
    premium: true,
  });

  if (cloud.status === 'error') {
    return <div>Error!</div>;
  }

  if (cloud.status === 'loading') {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  const { ClassicEditor, Essentials, Paragraph, Bold, Italic } = cloud.CKEditor;

  const { FormatPainter } = cloud.CKEditorPremiumFeatures;

  return (
    <CKEditor
      editor={ClassicEditor}
      data={value} // Sử dụng giá trị từ props
      config={{
        licenseKey: licenseKey,
        plugins: [Essentials, Paragraph, Bold, Italic, FormatPainter],
        toolbar: ['undo', 'redo', '|', 'bold', 'italic', '|', 'formatPainter'],
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
}
