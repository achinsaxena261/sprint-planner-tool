import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

interface StoryPointMapping {
  days: number;
  points: number;
}

const StoryPointsForm: React.FC = () => {
  const [cookies, setCookie] = useCookies(['storyPointsMapping']);
  const [storyPointsMapping, setStoryPointsMapping] = useState<StoryPointMapping[]>(cookies.storyPointsMapping || [
    { days: 1, points: 1 },
    { days: 2, points: 1 },
    { days: 3, points: 3 },
    { days: 4, points: 3 },
    { days: 5, points: 5 },
    { days: 6, points: 5 },
    { days: 7, points: 5 },
    { days: 8, points: 8 },
    { days: 9, points: 8 },
    { days: 10, points: 8 },
  ]);

  const handleChange = (index: number, field: string, value: number) => {
    const updatedMapping = storyPointsMapping.map((mapping, i) =>
      i === index ? { ...mapping, [field]: value } : mapping
    );
    setStoryPointsMapping(updatedMapping);
    setCookie('storyPointsMapping', updatedMapping, { path: '/' });
  };

  const handleAddRow = () => {
    const updatedMapping = [...storyPointsMapping, { days: 0, points: 0 }];
    setStoryPointsMapping(updatedMapping);
    setCookie('storyPointsMapping', updatedMapping, { path: '/' });
  };

  const handleRemoveRow = (index: number) => {
    const updatedMapping = storyPointsMapping.filter((_, i) => i !== index);
    setStoryPointsMapping(updatedMapping);
    setCookie('storyPointsMapping', updatedMapping, { path: '/' });
  };

  return (
    <div>
      <h2>Story Points Mapping</h2>
      <table>
        <thead>
          <tr>
            <th>Days</th>
            <th>Points</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {storyPointsMapping.map((mapping, index) => (
            <tr key={index}>
              <td>
                <input
                  type="number"
                  value={mapping.days}
                  onChange={(e) => handleChange(index, 'days', parseInt(e.target.value, 10))}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={mapping.points}
                  onChange={(e) => handleChange(index, 'points', parseInt(e.target.value, 10))}
                />
              </td>
              <td>
                <button onClick={() => handleRemoveRow(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleAddRow}>Add Row</button>
    </div>
  );
};

export default StoryPointsForm;
