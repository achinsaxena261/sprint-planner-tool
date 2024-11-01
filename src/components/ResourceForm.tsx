import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import ConfigForm from './ConfigForm';
import StoryPointsForm from './StoryPointsForm';

export interface Resource {
    resourceName: string;
    role: string;
    location: string;
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

    const getDefaultFormData = () => {
        const updatedFormData = {
            resourceName: '',
            role: '',
            location: selectedConfig.workLocation,
            maxCapacityPerDay: selectedConfig.defaultWorkingHoursPerDay,
            workdaysPerSprint: selectedConfig.availableDaysPerSprint,
            leaves: 0,
            availableDays: selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays,
            totalAvailableHours: (selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays) * selectedConfig.defaultWorkingHoursPerDay,
            totalAvailableCapacity: Math.round(((selectedConfig.availableDaysPerSprint - selectedConfig.publicHolidays) * selectedConfig.defaultWorkingHoursPerDay) / 8),
            storyPoints: 0,
        };

        const mapping = storyPointsMapping.find(m => m.days === updatedFormData.totalAvailableCapacity);
        updatedFormData.storyPoints = mapping ? mapping.points : 0;
        return updatedFormData;
    }

    const [formData, setFormData] = useState<Resource>(getDefaultFormData());

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [dialog, setDialog] = useState<boolean>(false);
    const [openedConfig, setOpenedConfig] = useState<boolean>(false);
    const [openedMappings, setOpenedMappings] = useState<boolean>(false);
    const [openedResource, setOpenedResource] = useState<boolean>(false);

    useEffect(() => {
        if (selectedConfig) {
            const updatedFormData = getDefaultFormData();
            setFormData(updatedFormData);
        }
    }, [selectedConfigIndex, selectedConfig]);

    useEffect(() => {
        if(editIndex == null && selectedConfig) {
            const updatedFormData = getDefaultFormData();
            setFormData(updatedFormData);            
        }
    }, [editIndex])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = parseInt(value, 10);

        const updatedFormData = {
            ...formData,
            [name]: name === 'leaves' || name === 'maxCapacityPerDay' ? newValue : value,
        };

        if (name === 'maxCapacityPerDay' || name === 'leaves') {
            updatedFormData.availableDays = selectedConfig.availableDaysPerSprint - updatedFormData.leaves - selectedConfig.publicHolidays;
            updatedFormData.totalAvailableHours = updatedFormData.availableDays * updatedFormData.maxCapacityPerDay;
            updatedFormData.totalAvailableCapacity = Math.round(updatedFormData.totalAvailableHours / selectedConfig.defaultWorkingHoursPerDay);

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
        setEditIndex(null);
        setDialog(false);
    };

    const handleEdit = (index: number) => {
        setFormData(resources[index]);
        openResource(index);
    };

    const handleRemove = (index: number) => {
        const updatedResources = resources.filter((_, i) => i !== index);
        setResources(updatedResources);
        setCookie('resources', updatedResources, { path: '/' });
    };

    const openConfig = () => {
        setOpenedConfig(true);
        setOpenedMappings(false);
        setOpenedResource(false);
        setDialog(true);
    }

    const openMappings = () => {
        setOpenedConfig(false);
        setOpenedMappings(true);
        setOpenedResource(false);
        setDialog(true);
    }

    const openResource = (index: number | null) => {
        setEditIndex(index);
        setOpenedConfig(false);
        setOpenedMappings(false);
        setOpenedResource(true);
        setDialog(true);
    }

    return (
        <div>
            <div className="toolbar">
                <button onClick={openConfig}>Manage Configuration</button>
                <button onClick={openMappings}>Story Pointing Config</button>
                <button onClick={() => openResource(null)}>Add New Resource</button>
            </div>
            <h3>Existing Resources</h3>
            <table>
                <thead>
                    <tr>
                        <th>Resource Name</th>
                        <th>Role</th>
                        <th>Location</th>
                        <th>Workdays per Sprint</th>
                        <th>Leaves</th>
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
                            <td>{resource.location}</td>
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
            <div className={dialog ? "modal-dialog-overlay show" : "modal-dialog-overlay"}>
                <div className="modal-dialog">
                    <div className={openedResource ? "modal-content show" : "modal-content"}>
                        <div className='modal-dialog-header'>
                            <h3>Manage Resource</h3>
                            <button onClick={() => setDialog(false)} className="modal-action-close">X</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <table>
                                <tr>
                                    <td><label>Resource Name</label></td>
                                    <td><input type="text" name="resourceName" value={formData.resourceName} onChange={handleChange} placeholder="Resource Name" required /></td>
                                </tr>
                                <tr>
                                    <td><label>Role</label></td>
                                    <td><input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role" required /></td>
                                </tr>
                                <tr>
                                    <td><label>Location</label></td>
                                    <td>
                                        <select value={selectedConfigIndex} onChange={handleConfigChange}>
                                            {cookies.configs && cookies.configs.map((config, index) => (
                                                <option key={index} value={index}>
                                                    {config.workLocation}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label>Max Capacity Per Day (hrs)</label></td>
                                    <td><input type="number" name="maxCapacityPerDay" value={formData.maxCapacityPerDay} onChange={handleChange} placeholder="Max Capacity Per Day" required /></td>
                                </tr>
                                <tr>
                                    <td><label>Leaves</label></td>
                                    <td><input type="number" name="leaves" value={formData.leaves} onChange={handleChange} placeholder="Leaves/Public Holidays" required /></td>
                                </tr>
                                <tr>
                                    <td><label>Available Days</label></td>
                                    <td><input type="number" name="availableDays" value={formData.availableDays} placeholder="Available Days" readOnly /></td>
                                </tr>
                                <tr>
                                    <td><label>Available Hours</label></td>
                                    <td><input type="number" name="totalAvailableHours" value={formData.totalAvailableHours} placeholder="Total Available Hours" readOnly /></td>
                                </tr>
                                <tr>
                                    <td><label>Total Available Capacity (Man-Days)</label></td>
                                    <td><input type="number" name="totalAvailableCapacity" value={formData.totalAvailableCapacity} placeholder="Total Available Capacity" readOnly /></td>
                                </tr>
                                <tr>
                                    <td><label>Achievable Story Points</label></td>
                                    <td><input type="number" name="storyPoints" value={formData.storyPoints} placeholder="Story Points" readOnly /></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <button type="submit">{editIndex !== null ? 'Update Resource' : 'Add Resource'}</button>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                    <div className={openedConfig ? "modal-content show" : "modal-content"}>
                        <div className='modal-dialog-header'>
                            <h3>Configuration</h3>
                            <button onClick={() => setDialog(false)} className="modal-action-close">X</button>
                        </div>
                        <ConfigForm />
                    </div>
                    <div className={openedMappings ? "modal-content show" : "modal-content"}>
                        <div className='modal-dialog-header'>
                            <h3>Story Points</h3>
                            <button onClick={() => setDialog(false)} className="modal-action-close">X</button>
                        </div>
                        <StoryPointsForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceForm;
