import { toast } from "react-toastify"

class TaskService {
  constructor() {
    this.apperClient = null;
    this.tableName = 'task_c';
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "is_completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "priority_c" } }
        ],
        orderBy: [
          { fieldName: "created_at_c", sorttype: "DESC" }
        ],
        pagingInfo: { limit: 100, offset: 0 }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      // Map database fields to UI-friendly format
      return response.data.map(task => ({
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        isCompleted: task.is_completed_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        updatedAt: task.updated_at_c || task.ModifiedOn,
        dueDate: task.due_date_c || null,
        category: task.category_c || 'Personal',
        priority: task.priority_c || 'Medium',
        tags: task.Tags || '',
        owner: task.Owner
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tasks:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "CreatedBy" } },
          { field: { Name: "ModifiedOn" } },
          { field: { Name: "ModifiedBy" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "is_completed_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "category_c" } },
          { field: { Name: "priority_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response || !response.data) {
        throw new Error("Task not found");
      }

      const task = response.data;
      return {
        Id: task.Id,
        title: task.title_c || task.Name || '',
        description: task.description_c || '',
        isCompleted: task.is_completed_c || false,
        createdAt: task.created_at_c || task.CreatedOn,
        updatedAt: task.updated_at_c || task.ModifiedOn,
        dueDate: task.due_date_c || null,
        category: task.category_c || 'Personal',
        priority: task.priority_c || 'Medium',
        tags: task.Tags || '',
        owner: task.Owner
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching task with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Map UI fields to database fields and include only Updateable fields
      const dbRecord = {
        Name: taskData.title || 'Untitled Task',
        title_c: taskData.title || 'Untitled Task',
        description_c: taskData.description || '',
        is_completed_c: false,
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString(),
        due_date_c: taskData.dueDate ? taskData.dueDate.split('T')[0] : null, // Date format YYYY-MM-DD
        category_c: taskData.category || 'Personal',
        priority_c: taskData.priority || 'Medium',
        Tags: taskData.tags || ''
      };

      const params = {
        records: [dbRecord]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} task records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const task = successfulRecords[0].data;
          return {
            Id: task.Id,
            title: task.title_c || task.Name || '',
            description: task.description_c || '',
            isCompleted: task.is_completed_c || false,
            createdAt: task.created_at_c || task.CreatedOn,
            updatedAt: task.updated_at_c || task.ModifiedOn,
            dueDate: task.due_date_c || null,
            category: task.category_c || 'Personal',
            priority: task.priority_c || 'Medium',
            tags: task.Tags || '',
            owner: task.Owner
          };
        }
      }
      
      throw new Error("Failed to create task");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, updates) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Map UI fields to database fields and include only Updateable fields
      const dbUpdates = {
        Id: parseInt(id)
      };
      
      if (updates.title !== undefined) {
        dbUpdates.Name = updates.title;
        dbUpdates.title_c = updates.title;
      }
      if (updates.description !== undefined) dbUpdates.description_c = updates.description;
      if (updates.isCompleted !== undefined) dbUpdates.is_completed_c = updates.isCompleted;
      if (updates.dueDate !== undefined) dbUpdates.due_date_c = updates.dueDate ? updates.dueDate.split('T')[0] : null;
      if (updates.category !== undefined) dbUpdates.category_c = updates.category;
      if (updates.priority !== undefined) dbUpdates.priority_c = updates.priority;
      if (updates.tags !== undefined) dbUpdates.Tags = updates.tags;
      
      dbUpdates.updated_at_c = new Date().toISOString();

      const params = {
        records: [dbUpdates]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} task records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const task = successfulUpdates[0].data;
          return {
            Id: task.Id,
            title: task.title_c || task.Name || '',
            description: task.description_c || '',
            isCompleted: task.is_completed_c || false,
            createdAt: task.created_at_c || task.CreatedOn,
            updatedAt: task.updated_at_c || task.ModifiedOn,
            dueDate: task.due_date_c || null,
            category: task.category_c || 'Personal',
            priority: task.priority_c || 'Medium',
            tags: task.Tags || '',
            owner: task.Owner
          };
        }
      }
      
      throw new Error("Failed to update task");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} task records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting task:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async toggleComplete(id) {
    try {
      // Get current task state
      const currentTask = await this.getById(id);
      
      // Update completion status
      return await this.update(id, { 
        isCompleted: !currentTask.isCompleted 
      });
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error toggling task completion:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export default new TaskService()