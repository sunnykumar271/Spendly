// src/components/common/ConfirmDialog.jsx
import Modal from './Modal'
import Spinner from './Spinner'

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title || 'Confirm Action'} size="sm">
    <p className="text-sm text-surface-600 dark:text-surface-400 mb-6">{message}</p>
    <div className="flex gap-3 justify-end">
      <button onClick={onClose} className="btn-secondary btn">Cancel</button>
      <button onClick={onConfirm} disabled={loading} className="btn-danger btn">
        {loading ? <Spinner size="sm" /> : 'Delete'}
      </button>
    </div>
  </Modal>
)

export default ConfirmDialog
