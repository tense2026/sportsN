import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AdminToggle() {
  const { isAdminMode, toggleAdminMode } = useAuth();

  return (
    <label className="flex items-center gap-1.5 cursor-pointer select-none bg-red-500/5 hover:bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20">
      <input
        type="checkbox"
        checked={isAdminMode}
        onChange={(e) => {
          toggleAdminMode(e.target.checked);
          toast.success(
            e.target.checked
              ? '관리자 모드가 활성화되었습니다. 슬롯을 수동으로 잠글 수 있습니다.'
              : '관리자 모드가 비활성화되었습니다.'
          );
        }}
        className="rounded accent-red-500 w-3.5 h-3.5"
      />
      <span className="text-[11px] text-red-400 font-semibold tracking-wider">어드민 모드</span>
    </label>
  );
}
