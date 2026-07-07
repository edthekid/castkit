import { useTranslation } from '../../_i18n/useTranslation';

interface MemberInputProps {
  inputText: string;
  memberCount: number;
  /** 重複した名前（あれば警告を表示する） */
  duplicateMembers: string[];
  onChange: (text: string) => void;
}

export function MemberInput({ inputText, memberCount, duplicateMembers, onChange }: MemberInputProps) {
  const { t } = useTranslation();
  return (
    <div className="ck-section mb-4 ck-slide-up">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-black text-sm tracking-wide flex items-center gap-2">
          <span className="ck-gradient-text">①</span> {t('memberInput.title')}
        </h3>
        <span className="ck-badge">{t('memberInput.count', { count: memberCount })}</span>
      </div>
      <textarea
        className="ck-textarea w-full h-32 p-3 font-medium text-sm"
        placeholder={t('memberInput.placeholder')}
        value={inputText}
        onChange={(e) => onChange(e.target.value)}
      />
      {duplicateMembers.length > 0 && (
        <p role="alert" className="mt-2 text-xs font-bold text-ck-danger">
          {t('memberInput.duplicateWarning', { names: duplicateMembers.join(', ') })}
        </p>
      )}
    </div>
  );
}
