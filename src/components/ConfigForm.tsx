import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

interface Config {
  workLocation: string;
  availableDaysPerSprint: number;
  defaultWorkingHoursPerDay: number;
  publicHolidays: number;
}

const ConfigForm: React.FC = () => {
  const [cookies, setCookie] = useCookies(['configs']);
  const [configs, setConfigs] = useState<Config[]>(cookies.configs || []);
  const [formData, setFormData] = useState<Config>({
    workLocation: '',
    availableDaysPerSprint: 10,
    defaultWorkingHoursPerDay: 8,
    publicHolidays: 0,
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfigs = editIndex !== null
      ? configs.map((config, index) => index === editIndex ? formData : config)
      : [...configs, formData];
    setConfigs(updatedConfigs);
    setCookie('configs', updatedConfigs, { path: '/' });
    setFormData({
      workLocation: '',
      availableDaysPerSprint: 10,
      defaultWorkingHoursPerDay: 8,
      publicHolidays: 0,
    });
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    setFormData(configs[index]);
    setEditIndex(index);
  };

  const handleRemove = (index: number) => {
    const updatedConfigs = configs.filter((_, i) => i !== index);
    setConfigs(updatedConfigs);
    setCookie('configs', updatedConfigs, { path: '/' });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <table>
          <tr>
            <td><label>Work Location:</label></td>
            <td><input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} required /></td>
          </tr>
          <tr>
            <td><label>Available Days per Sprint:</label></td>
            <td><input type="number" name="availableDaysPerSprint" value={formData.availableDaysPerSprint} onChange={handleChange} required /></td>
          </tr>
          <tr>
            <td><label>
              Default Working Hours per Day:</label></td>
            <td><input type="number" name="defaultWorkingHoursPerDay" value={formData.defaultWorkingHoursPerDay} onChange={handleChange} required /></td>
          </tr>
          <tr>
            <td><label>
              Public Holidays:</label></td>
            <td><input type="number" name="publicHolidays" value={formData.publicHolidays} onChange={handleChange} required /></td>
          </tr>
          <tr>
            <td></td>
            <td><button type="submit">{editIndex !== null ? 'Update Configuration' : 'Add Configuration'}</button></td>
          </tr>
        </table>
      </form>
      <h3>Existing Configurations</h3>
      <table>
        {configs.map((config, index) => (
          <tr key={index}>
            <td>{config.workLocation}: {config.availableDaysPerSprint} days, {config.defaultWorkingHoursPerDay} hrs/day, {config.publicHolidays} holidays</td>
            <td><button onClick={() => handleEdit(index)}>Edit</button></td>
            <td><button onClick={() => handleRemove(index)}>Remove</button></td>
          </tr>
        ))}
      </table>
    </div>
  );
};

export default ConfigForm;
