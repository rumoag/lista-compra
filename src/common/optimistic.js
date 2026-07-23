// Helper de actualización optimista — BR-6 (fail-fast sin reintentos, ver nfr-design-patterns.md)
//
// apply(): aplica el cambio a la vista/estado local inmediatamente.
// remoteOperation(): promesa que representa la escritura real contra Supabase.
// revert(): revierte apply() si remoteOperation() falla.
// onError(err): callback opcional para mostrar un mensaje de error genérico al usuario.
export async function applyOptimistic({ apply, revert, remoteOperation, onError }) {
  apply();
  try {
    await remoteOperation();
  } catch (err) {
    revert();
    if (onError) onError(err);
    throw err;
  }
}
