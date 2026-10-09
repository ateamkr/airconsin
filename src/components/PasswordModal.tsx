import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext.tsx';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { siteData } = useSiteData();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = siteData.settings.adminPassword || '8849';

    if (password.trim() === correctPassword) {
      setError(false);
      setPassword('');
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-5 sm:p-7 shadow-2xl animate-scaleUp border border-gray-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-[#0070d2] flex items-center justify-center mb-3 sm:mb-4 shadow-xs">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
            관리자 로그인
          </h3>
          <p className="text-xs text-gray-500 mt-1 break-keep">
            홈페이지 컨텐츠 수정을 위해 관리자 비밀번호를 입력해주세요.
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-5 sm:mt-6 space-y-4">
            <div className="relative">
              <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="비밀번호 입력 (4자리)"
                className={`w-full py-3.5 pl-11 pr-4 text-center tracking-widest text-base font-bold rounded-xl border bg-gray-50 focus:bg-white focus:outline-none transition-all ${
                  error
                    ? 'border-red-400 text-red-600 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-200 text-gray-800 focus:border-[#0070d2] focus:ring-2 focus:ring-blue-100'
                }`}
              />
              <KeyRound className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {error && (
              <p className="text-xs text-red-500 flex items-center justify-center gap-1 font-semibold animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>비밀번호가 올바르지 않습니다.</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0070d2] hover:bg-[#005fb8] active:scale-[0.99] text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>확인 및 로그인</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
