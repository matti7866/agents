import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';

interface Agent {
  id: number;
  company: string;
  customer_id: number;
  email: string;
}

interface AuthContextType {
  agent: Agent | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('agent_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchAgentProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAgentProfile = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/agent/me.php`);
      console.log('Agent profile response:', response.data);
      
      if (response.data.success) {
        // JWTHelper merges data directly into response
        // Extract only the agent fields we need
        const agentData = {
          id: response.data.id || response.data.data?.id,
          company: response.data.company || response.data.data?.company,
          customer_id: response.data.customer_id || response.data.data?.customer_id,
          email: response.data.email || response.data.data?.email,
        };
        
        console.log('Agent profile data:', agentData);
        setAgent(agentData);
      } else {
        console.warn('Agent profile fetch failed:', response.data);
        localStorage.removeItem('agent_token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (error: any) {
      console.error('Failed to fetch agent profile:', error);
      console.error('Error response:', error.response?.data);
      
      // Only clear token if it's actually an auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('agent_token');
        delete axios.defaults.headers.common['Authorization'];
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/agent/login.php`, {
        email,
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // JWTHelper::sendResponse merges data directly, not nested
        // Response structure: { success: true, message: "...", token: "...", agent: {...} }
        const token = response.data.token || response.data.data?.token;
        
        // Extract agent data (might be direct or under data key)
        let agentData = response.data.agent || response.data.data?.agent;
        
        // If still not found, try extracting from response directly
        if (!agentData && response.data.id) {
          agentData = {
            id: response.data.id,
            company: response.data.company,
            customer_id: response.data.customer_id,
            email: response.data.email,
          };
        }
        
        if (!token) {
          console.error('Login response structure:', response.data);
          throw new Error('Token not received from server');
        }
        
        console.log('Extracted token:', token);
        console.log('Extracted agent data:', agentData);
        
        localStorage.setItem('agent_token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAgent(agentData);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Response data:', error.response?.data);
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('agent_token');
    delete axios.defaults.headers.common['Authorization'];
    setAgent(null);
  };

  return (
    <AuthContext.Provider
      value={{
        agent,
        isAuthenticated: !!agent,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

