import Arrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import * as React from 'react';
import { Link } from 'react-router';

export interface IDepartmentTitleProps {
  name: string;
  url: string;
}

export const DepartmentTitle = ({ name, url }: IDepartmentTitleProps) => (
  <Link to={url.toLowerCase()} >
    <div className="main__department-title">
      <div className="main__department-title-icon">
        <Arrow style={{ height: '35px', width: '35px' }} />
      </div>
      <div className="main__department-title-label">
        {`${name}`}
      </div>
    </div>
  </Link>
);

export default DepartmentTitle;
