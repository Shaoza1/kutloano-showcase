// Utility functions for course data management

export const saveCourseData = (courses: any[]) => {
  // Save to localStorage
  localStorage.setItem('portfolio_courses', JSON.stringify(courses));
  
  // Create downloadable JSON backup
  const dataStr = JSON.stringify(courses, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'courses.json';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  // Show instructions to user
  console.log('📁 Course data saved! Please:');
  console.log('1. Save the downloaded courses.json file');
  console.log('2. Place it in public/data/courses.json for permanent storage');
  console.log('3. This ensures your certificates persist across browser sessions');
};

export const loadCourseData = async (): Promise<any[]> => {
  try {
    // Try JSON file first
    const response = await fetch('/data/courses.json');
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (error) {
    console.log('JSON file not available, using localStorage');
  }
  
  // Fallback to localStorage
  try {
    const localData = localStorage.getItem('portfolio_courses');
    return localData ? JSON.parse(localData) : [];
  } catch (error) {
    console.error('Error loading course data:', error);
    return [];
  }
};