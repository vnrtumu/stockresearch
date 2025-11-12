import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-10388338`;

export interface BrokerCredentials {
  broker: string;
  clientId: string;
  apiKey?: string;
  apiSecret?: string;
}

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
}

export interface PortfolioSummary {
  invested: number;
  currentValue: number;
  returns: number;
  returnsPercent: number;
}

export interface BrokerData {
  broker: string;
  clientId: string;
  status: string;
  connectedAt: string;
  lastSynced: string | null;
}

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`,
});

export async function connectBroker(userId: string, credentials: BrokerCredentials) {
  const response = await fetch(`${API_BASE_URL}/brokers/connect`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ ...credentials, userId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to connect broker');
  }

  return response.json();
}

export async function getConnectedBrokers(userId: string) {
  const response = await fetch(`${API_BASE_URL}/brokers/${userId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch brokers');
  }

  return response.json();
}

export async function syncBrokerData(userId: string, broker: string) {
  const response = await fetch(`${API_BASE_URL}/brokers/sync`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ userId, broker }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to sync portfolio');
  }

  return response.json();
}

export async function getPortfolioData(userId: string) {
  const response = await fetch(`${API_BASE_URL}/portfolio/${userId}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch portfolio');
  }

  return response.json();
}

export async function disconnectBroker(userId: string, broker: string) {
  const response = await fetch(`${API_BASE_URL}/brokers/${userId}/${broker}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to disconnect broker');
  }

  return response.json();
}
