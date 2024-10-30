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
        <h2>Configuration</h2>
        <label>
          Work Location:
          <input type="text" name="workLocation" value={formData.workLocation} onChange={handleChange} required />
        </label>
        <label>
          Available Days per Sprint:
          <input type="number" name="availableDaysPerSprint" value={formData.availableDaysPerSprint} onChange={handleChange} required />
        </label>
        <label>
          Default Working Hours per Day:
          <input type="number" name="defaultWorkingHoursPerDay" value={formData.defaultWorkingHoursPerDay} onChange={handleChange} required />
        </label>
        <label>
          Public Holidays:
          <input type="number" name="publicHolidays" value={formData.publicHolidays} onChange={handleChange} required />
        </label>
        <button type="submit">{editIndex !== null ? 'Update Configuration' : 'Add Configuration'}</button>
      </form>
      <h3>Existing Configurations</h3>
      <ul>
        {configs.map((config, index) => (
          <li key={index}>
            {config.workLocation}: {config.availableDaysPerSprint} days, {config.defaultWorkingHoursPerDay} hrs/day, {config.publicHolidays} holidays
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleRemove(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConfigForm;
