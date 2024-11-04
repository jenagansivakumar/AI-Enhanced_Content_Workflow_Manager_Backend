
export interface ContentData {
    title: string;
    body: string;
    status: "draft" | "review" | "published";
    tags: string[];
  }
  
export default ContentData