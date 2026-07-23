import { describe, it, expect, vi } from 'vitest';
import { applyOptimistic } from '../../src/common/optimistic.js';

describe('applyOptimistic', () => {
  it('aplica el cambio inmediatamente antes de que resuelva la operación remota', async () => {
    const apply = vi.fn();
    const revert = vi.fn();
    const remoteOperation = vi.fn().mockResolvedValue(undefined);

    await applyOptimistic({ apply, revert, remoteOperation });

    expect(apply).toHaveBeenCalledOnce();
    expect(revert).not.toHaveBeenCalled();
  });

  it('revierte el cambio y propaga el error si la operación remota falla', async () => {
    const apply = vi.fn();
    const revert = vi.fn();
    const onError = vi.fn();
    const error = new Error('network error');
    const remoteOperation = vi.fn().mockRejectedValue(error);

    await expect(applyOptimistic({ apply, revert, remoteOperation, onError })).rejects.toThrow(
      'network error'
    );

    expect(apply).toHaveBeenCalledOnce();
    expect(revert).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledWith(error);
  });

  it('no realiza reintentos automáticos (fail-fast, Question 3 = A de NFR Design)', async () => {
    const remoteOperation = vi.fn().mockRejectedValue(new Error('fail'));

    await expect(
      applyOptimistic({ apply: () => {}, revert: () => {}, remoteOperation })
    ).rejects.toThrow();

    expect(remoteOperation).toHaveBeenCalledOnce();
  });
});
