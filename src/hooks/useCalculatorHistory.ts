import { useState, useEffect, useCallback } from 'react';

export interface HistoryEntry {
  id: string;
  calculatorType: string;
  calculatorName: string;
  inputs: Record<string, string | number>;
  result: string | number | Record<string, string | number>;
  timestamp: Date;
}

const STORAGE_KEY = 'medical-calculator-history';
const MAX_ENTRIES = 50;

export function useCalculatorHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const entries = parsed.map((entry: HistoryEntry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
        setHistory(entries);
      }
    } catch (error) {
      console.error('Error loading calculator history:', error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving calculator history:', error);
    }
  }, [history]);

  const addEntry = useCallback((
    calculatorType: string,
    calculatorName: string,
    inputs: Record<string, string | number>,
    result: string | number | Record<string, string | number>
  ) => {
    const newEntry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      calculatorType,
      calculatorName,
      inputs,
      result,
      timestamp: new Date(),
    };

    setHistory(prev => {
      const updated = [newEntry, ...prev];
      // Keep only the last MAX_ENTRIES
      return updated.slice(0, MAX_ENTRIES);
    });

    return newEntry;
  }, []);

  const removeEntry = useCallback((id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const getHistoryByType = useCallback((calculatorType: string) => {
    return history.filter(entry => entry.calculatorType === calculatorType);
  }, [history]);

  return {
    history,
    addEntry,
    removeEntry,
    clearHistory,
    getHistoryByType,
  };
}
