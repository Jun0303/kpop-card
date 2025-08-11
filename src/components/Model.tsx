type ModalProps = {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function Modal({ title, onClose, onConfirm }: ModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4 text-black">{title}</h2>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            確認
          </button>
        </div>
      </div>
    </div>
  );
}
