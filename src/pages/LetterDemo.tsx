import LetterEditor from "@/ui/letter-editor";
import { useState } from "react";
const LetterDemo = () => {
  const [showToolbar, setShowToolbar] = useState(false);
  
  const sampleConfig = {
    "id": 1,
    "letter_category_id": 8,
    "name": "기본",
    "price": 800,
    "thumbnail": "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp1-front.jpg",
    "thumbnail_back": "https://dongl.s3.ap-northeast-2.amazonaws.com/letter-attachment/temp1-back.jpg",
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
    "created_at": "2025-07-27T00:42:52.598Z",
    "updated_at": "2025-07-27T02:30:50.989Z"
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Letter Editor Demo</h1>
        <p className="text-gray-600">
          TipTap letter editor matching production UI. Toggle toolbar to see configuration options.
        </p>
        <div className="mt-4">
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showToolbar ? 'Hide' : 'Show'} Toolbar & Settings
          </button>
        </div>
      </div>
      
      <LetterEditor
        showToolbar={showToolbar}
        initialContent="<p>안녕하세요,</p><p>편지 에디터에 오신 것을 환영합니다! 이 에디터는 프로덕션 UI를 정확히 재현했습니다.</p><p>주요 특징:</p><p>• 설정 객체를 통한 레이아웃 제어</p><p>• 배경 이미지 지원</p><p>• 자동 페이지네이션</p><p>• 프로덕션과 동일한 스타일링</p><p>• 줌 기능</p><p>• 한국어 폰트 지원 (Ainmom)</p><p>편지를 작성해보세요!</p><p>감사합니다,<br>편지 에디터</p>"
        onUpdate={(content) => {
          console.log("Editor content updated:", content);
        }}
      />
    </div>
  );
};

export default LetterDemo;