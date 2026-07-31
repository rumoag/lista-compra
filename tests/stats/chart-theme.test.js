import { describe, it, expect, afterEach } from 'vitest';
import { getChartColors } from '../../src/stats/chart-theme.js';

describe('getChartColors', () => {
  afterEach(() => {
    document.documentElement.style.cssText = '';
  });

  it('lee los tokens de color M3 desde las variables CSS del documento', () => {
    document.documentElement.style.setProperty('--md-sys-color-primary', '#506628');
    document.documentElement.style.setProperty('--md-sys-color-secondary', '#596248');
    document.documentElement.style.setProperty('--md-sys-color-tertiary', '#396661');
    document.documentElement.style.setProperty('--md-sys-color-on-surface', '#1a1c15');
    document.documentElement.style.setProperty('--md-sys-color-outline-variant', '#c5c8b9');

    const colors = getChartColors();

    expect(colors).toEqual({
      primary: '#506628',
      secondary: '#596248',
      tertiary: '#396661',
      onSurface: '#1a1c15',
      outlineVariant: '#c5c8b9',
    });
  });
});
