import LetterTiptapEditor from "@/ui/letter-tiptap-editor";

const LetterTiptapDemo = () => {
  const sampleConfig = {
    "id": 3,
    "letter_category_id": 9,
    "name": "연보라",
    "price": 1000,
    "thumbnail": "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp3-front.jpg",
    "thumbnail_back": "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp3-back.jpg",
    "thumbnail_original": "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp3-front.jpg",
    "top_padding": 54,
    "context_width": 292,
    "context_height": 431,
    "context_line_height": 24,
    "max_line": 18,
    "sort_order": 0,
    "is_active": true,
    "count": 0,
    "tags": null,
    "created_at": "2025-07-27T02:45:30.998Z",
    "updated_at": "2025-07-27T02:45:30.998Z"
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Letter TipTap Demo with Pagination Backgrounds</h1>
        <p className="text-gray-600">
          TipTap editor with automatic pagination and letter background on each page.
          Type enough content to see multiple pages with backgrounds.
        </p>
      </div>
      
      <LetterTiptapEditor
        config={sampleConfig}
        showToolbar={true}
        initialContent="<p>안녕하세요,</p><p>이것은 각 페이지에 편지 배경이 있는 TipTap 에디터입니다. 자동으로 페이지가 나뉘고 각 페이지마다 같은 배경 이미지가 적용됩니다.</p><p>더 많은 내용을 입력해보세요:</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p><p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p><p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p><p>계속 입력하면 새 페이지가 생성되고 각 페이지마다 동일한 편지 배경이 적용됩니다.</p><p>감사합니다!</p>"
        onUpdate={(content) => {
          console.log("Editor content updated:", content);
        }}
      />
    </div>
  );
};

export default LetterTiptapDemo;