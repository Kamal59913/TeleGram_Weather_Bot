import { ReactNode } from "react";

interface ModuleHeaderProps {
  pageTitle: string;
  destination_name?: string;
  destination_path?: string;
  is_reverse?: boolean;
  footerContent?: ReactNode;
}

const ModuleHeaderNoBg: React.FC<ModuleHeaderProps> = ({
  footerContent,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 mb-6">
      
          {footerContent && (
       
        <> 
         {footerContent}
        </>
      
      )}
        
  
    </div>
  );
};

export default ModuleHeaderNoBg;
