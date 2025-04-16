
type TimeKeyword = {
  keywords: string[];
  minutes: number;
};

const timeKeywords: TimeKeyword[] = [
  {
    keywords: ['확인', '체크', '검토', '읽기', '보기'],
    minutes: 5
  },
  {
    keywords: ['정리', '작성', '준비', '요약'],
    minutes: 15
  },
  {
    keywords: ['미팅', '회의', '통화', '미디어', '영상'],
    minutes: 30
  },
  {
    keywords: ['개발', '구현', '분석', '연구', '공부'],
    minutes: 60
  },
  {
    keywords: ['프로젝트', '교육', '강의'],
    minutes: 120
  }
];

export const estimateTaskTime = (title: string): number => {
  // 기본 예상 시간 (10분)
  const defaultMinutes = 10;
  
  // 제목을 소문자로 변환
  const lowerTitle = title.toLowerCase();
  
  // 가장 긴 예상 시간을 찾음
  let maxEstimate = defaultMinutes;
  
  timeKeywords.forEach(({ keywords, minutes }) => {
    if (keywords.some(keyword => lowerTitle.includes(keyword))) {
      maxEstimate = Math.max(maxEstimate, minutes);
    }
  });
  
  return maxEstimate;
};

