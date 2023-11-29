import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

export function useConfirmModal() {
  const { t } = useI18n();
  const $q = useQuasar();

  function showDeleteDialog(deleteName: string): Promise<void> {
    return new Promise((resolve) => {
      $q.dialog({
        title: t('common.form.confirm'),
        message: t('common.form.confirm_delete', { name: deleteName }),
        persistent: true,
        ok: t('common.form.delete'),
        cancel: t('common.form.cancel')
      }).onOk(() => {
        resolve();
      });
    })
  }

  function showUpdateDialog(updateName: string): Promise<void> {
    return new Promise((resolve) => {
      $q.dialog({
        title: t('common.form.confirm'),
        message: t('common.form.confirm_update', { name: updateName }),
        persistent: true,
        ok: t('common.form.update'),
        cancel: t('common.form.cancel')
      }).onOk(() => {
        resolve();
      });
    })
  }

  return {
    showDeleteDialog,
    showUpdateDialog
  }
}
