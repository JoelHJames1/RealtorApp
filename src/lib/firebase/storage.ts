import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const timestamp = Date.now();
  const storageRef = ref(storage, `${path}/${timestamp}_${file.name}`);
  
  try {
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (files: File[], path: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadFile(file, path));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};