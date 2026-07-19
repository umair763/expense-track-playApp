import React from "react";
import { Plus, ChevronRight } from "lucide-react";

export const PageHeader = ({
  breadcrumbs = [],
  title,
  subtitle,
  buttonLabel,
  buttonIcon: ButtonIcon = Plus,
  onButtonClick,
  showButton = true,
  buttonDisabled = false,
}) => {
  return (
    <div className="w-full mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-3 text-sm">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <span className=" font-medium text-[#4F30A9] hover:underline hover:cursor-pointer">
                {item}
              </span>
              {index !== breadcrumbs.length - 1 && (
                <ChevronRight className="text-[#4F30A9]" size={16} />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Header Content */}
      <div className="flex items-start justify-between gap-5">
        {/* Left Content */}
        <div>
          <h1 className="text-2xl font-bold text-[#4F30A9]">{title}</h1>

          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>

        {/* Action Button */}
        {showButton && buttonLabel && (
          <button
            type="button"
            disabled={buttonDisabled}
            onClick={onButtonClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed "
            style={{
              backgroundColor: "#4F30A9",
            }}
          >
            <ButtonIcon size={18} />
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
