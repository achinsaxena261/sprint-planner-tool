import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export interface Resource {
    resourceName: string;
    role: string;
    maxCapacityPerDay: number;
    workdaysPerSprint: number;
    leaves: number;
    availableDays: number;
    totalAvailableHours: number;
    totalAvailableCapacity: number;
    storyPoints: number;
}

const ResourceForm: React.FC = () => {
    const [cookies, setCookie] = useCookies(['resources', 'configs', 'storyPointsMapping']);
    const [resources, setResources] = useState<Resource[]>(cookies.resources || []);
    const [selectedConfigIndex, setSelectedConfigIndex] = useState<number>(0);
    const selectedConfig = cookies.configs ? cookies.configs[selectedConfigIndex] : null;
    const storyPointsMapping = cookies.storyPointsMapping || [
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
    ];

    const [formData, setFormData] = useState<Resource>({
        resourceName: '',
        role: '',
        maxCapacityPerDay: selectedConfig ? selectedConfig.defaultWorkingHoursPerDay : 0,
        workdaysPerSprint: selectedConfig ? selectedConfig.availableDaysPerSprint : 0,
        leaves: selectedConfig ? selectedConfig.publicHolidays : 0,
        availableDays: selectedConfig ? selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays : 0,
        totalAvailableHours: selectedConfig ? (selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays) * selectedConfig.defaultWorkingHoursPerDay : 0,
        totalAvailableCapacity: selectedConfig ? Math.round(((selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays) * selectedConfig.defaultWorkingHoursPerDay) / 8) : 0,
        storyPoints: 0,
    });

    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        if (selectedConfig) {
            const updatedFormData = {
                resourceName: '',
                role: '',
                maxCapacityPerDay: selectedConfig.defaultWorkingHoursPerDay,
                workdaysPerSprint: selectedConfig.availableDaysPerSprint,
                leaves: selectedConfig.publicHolidays,
                availableDays: selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays,
                totalAvailableHours: (selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays) * selectedConfig.defaultWorkingHoursPerDay,
                totalAvailableCapacity: Math.round(((selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays) * selectedConfig.defaultWorkingHoursPerDay) / 8),
                storyPoints: 0,
            };

            const mapping = storyPointsMapping.find(m => m.days === updatedFormData.totalAvailableCapacity);
            updatedFormData.storyPoints = mapping ? mapping.points : 0;

            setFormData(updatedFormData);
        }
    }, [selectedConfigIndex, selectedConfig]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = parseInt(value, 10);

        if (name === 'leaves' && newValue < selectedConfig.publicHolidays) {
            alert('Leaves cannot be less than public holidays.');
            return;
        }

        const updatedFormData = {
            ...formData,
            [name]: name === 'leaves' || name === 'maxCapacityPerDay' ? newValue : value,
        };

        if (name === 'maxCapacityPerDay' || name === 'leaves') {
            updatedFormData.availableDays = selectedConfig.availableDaysPerSprint - updatedFormData.leaves;
            updatedFormData.totalAvailableHours = updatedFormData.availableDays * updatedFormData.maxCapacityPerDay;
            updatedFormData.totalAvailableCapacity = Math.round(updatedFormData.totalAvailableHours / 8);

            const mapping = storyPointsMapping.find(m => m.days === updatedFormData.totalAvailableCapacity);
            updatedFormData.storyPoints = mapping ? mapping.points : 0;
        }

        setFormData(updatedFormData);
    };

    const handleConfigChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedConfigIndex(Number(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedResources = editIndex !== null
            ? resources.map((resource, index) => index === editIndex ? formData : resource)
            : [...resources, formData];
        setResources(updatedResources);
        setCookie('resources', updatedResources, { path: '/' });
        setFormData({
            resourceName: '',
            role: '',
            maxCapacityPerDay: selectedConfig.defaultWorkingHoursPerDay,
            workdaysPerSprint: selectedConfig.availableDaysPerSprint,
            leaves: selectedConfig.publicHolidays,
            availableDays: selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays,
            totalAvailableHours: (selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays) * selectedConfig.defaultWorkingHoursPerDay,
            totalAvailableCapacity: Math.round(((selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays) * selectedConfig.defaultWorkingHoursPerDay) / 8),
            storyPoints: 0,
        });
        setEditIndex(null);
    };

    const handleEdit = (index: number) => {
        setFormData(resources[index]);
        setEditIndex(index);
    };

    const handleRemove = (index: number) => {
        const updatedResources = resources.filter((_, i) => i !== index);
        setResources(updatedResources);
        setCookie('resources', updatedResources, { path: '/' });
    };

    return (
        <div>
            <h3>Existing Resources</h3>

            <table>
                <thead>
                    <tr>
                        <th>Resource Name</th>
                        <th>Role</th>
                        <th>Max Capacity Per Day (hrs)</th>
                        <th>Workdays per Sprint</th>
                        <th>Leaves/Public Holidays</th>
                        <th>Available Days</th>
                        <th>Total Available Hours</th>
                        <th>Total Available Capacity (in man-days)</th>
                        <th>Story Points</th>
                        <th>Edit</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {resources.map((resource: any, index: number) => (
                        <tr key={index}>
                            <td>{resource.resourceName}</td>
                            <td>{resource.role}</td>
                            <td>{resource.maxCapacityPerDay}</td>
                            <td>{resource.workdaysPerSprint}</td>
                            <td>{resource.leaves}</td>
                            <td>{resource.availableDays}</td>
                            <td>{resource.totalAvailableHours}</td>
                            <td>{resource.totalAvailableCapacity}</td>
                            <td>{resource.storyPoints}</td>
                            <td><button onClick={() => handleEdit(index)}>Edit</button></td>
                            <td><button onClick={() => handleRemove(index)}>Remove</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={handleSubmit}>
                <input type="text" name="resourceName" value={formData.resourceName} onChange={handleChange} placeholder="Resource Name" required />
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" required />
                <select value={selectedConfigIndex} onChange={handleConfigChange}>
                    {cookies.configs && cookies.configs.map((config, index) => (
                        <option key={index} value={index}>
                            {config.workLocation}
                        </option>
                    ))}
                </select>
                <input type="number" name="maxCapacityPerDay" value={formData.maxCapacityPerDay} onChange={handleChange} placeholder="Max Capacity Per Day" required />
                <input type="number" name="leaves" value={formData.leaves} onChange={handleChange} placeholder="Leaves/Public Holidays" required />
                <input type="number" name="availableDays" value={formData.availableDays} placeholder="Available Days" readOnly />
                <input type="number" name="totalAvailableHours" value={formData.totalAvailableHours} placeholder="Total Available Hours" readOnly />
                <input type="number" name="totalAvailableCapacity" value={formData.totalAvailableCapacity} placeholder="Total Available Capacity" readOnly />
                <input type="number" name="storyPoints" value={formData.storyPoints} placeholder="Story Points" readOnly />
                <button type="submit">{editIndex !== null ? 'Update Resource' : 'Add Resource'}</button>
            </form>
        </div>
    );
};

export default ResourceForm;
