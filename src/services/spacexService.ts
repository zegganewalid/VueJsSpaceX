import axios from 'axios';
import type { Launch } from '../types/Launch';

const API_BASE_URL = 'https://api.spacexdata.com/v5/launches';

export const SpaceXService = {
  async getNextLaunch(): Promise<Launch> {
    try {
      const response = await axios.get<Launch>(`${API_BASE_URL}/next`);
      return response.data;
    } catch (error) {
      console.error('Error fetching next launch:', error);
      throw error;
    }
  },

  async getPastLaunches(): Promise<Launch[]> {
    try {
      const response = await axios.get<Launch[]>(`${API_BASE_URL}/past`);
      return response.data;
    } catch (error) {
      console.error('Error fetching past launches:', error);
      throw error;
    }
  },

  async getLaunchDetails(id: string): Promise<Launch> {
    try {
      const response = await axios.get<Launch>(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching launch details for ID: ${id}`, error);
      throw error;
    }
  },

  async getFilteredLaunches(filter: 'all' | 'success' | 'failed'): Promise<Launch[]> {
    try {
      const allLaunches = await this.getPastLaunches();

      return allLaunches
        .filter(launch => {
          if (filter === 'success') return launch.success;
          if (filter === 'failed') return !launch.success && (launch.failures?.length ?? 0) > 0;
          return true;
        })
        .slice(0, 10);
    } catch (error) {
      console.error('Error fetching filtered launches:', error);
      throw error;
    }
  }
};
