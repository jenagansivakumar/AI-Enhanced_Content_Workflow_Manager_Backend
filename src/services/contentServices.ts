import ContentModel from '../models/contentModels';

export const fetchAllContent = async () => {
  return await ContentModel.find();
};

export const createContent = async (data: any) => {
  return await ContentModel.create(data);
};

// Placeholder for update and delete
export const updateContent = async (id: string, data: any) => {
  return await ContentModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteContent = async (id: string) => {
  return await ContentModel.findByIdAndDelete(id);
};
