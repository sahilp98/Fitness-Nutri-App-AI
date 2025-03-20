import { saveToLocalStorage, loadFromLocalStorage } from './localStorage';

// Export all user data as a JSON file
export const exportUserData = () => {
  try {
    const userData = {
      user: loadFromLocalStorage('fitness_user'),
      workoutPlans: loadFromLocalStorage('fitness_workoutPlans'),
      nutritionPlans: loadFromLocalStorage('fitness_nutritionPlans'),
      progress: loadFromLocalStorage('fitness_progress'),
      exportDate: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(userData);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `fitness_data_${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    return true;
  } catch (error) {
    console.error('Error exporting user data:', error);
    return false;
  }
};

// Import user data from a JSON file
export const importUserData = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          // Validate the data has the expected structure
          if (!data.user || !data.workoutPlans || !data.nutritionPlans || !data.progress) {
            throw new Error('Invalid data format');
          }
          
          // Save each section to localStorage
          saveToLocalStorage('fitness_user', data.user);
          saveToLocalStorage('fitness_workoutPlans', data.workoutPlans);
          saveToLocalStorage('fitness_nutritionPlans', data.nutritionPlans);
          saveToLocalStorage('fitness_progress', data.progress);
          
          resolve(true);
        } catch (error) {
          console.error('Error parsing imported data:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing user data:', error);
      reject(error);
    }
  });
};
