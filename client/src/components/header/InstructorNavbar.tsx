import { Link, useNavigate } from 'react-router-dom';
import { ProfileDropDown } from '../dropdown/profile-drop-down';

const InstructorNavbar = () => {
    const navigate = useNavigate();

    interface NavLink {
        label: string;
        to: string;
    }

    const instructorLinks: NavLink[] = [
        {
            label: 'Dashboard',
            to: '/instructor/dashboard',
        },
        {
            label: 'My Courses',
            to: '/instructor/my-courses',
        },
        {
            label: 'Create Course',
            to: '/instructor/create-course',
        },
      
    ];

    return (
        <nav className="w-full h-16 bg-primary-background-color text-primary-foreground flex items-center justify-between px-4">
            <div className="flex items-center justify-between w-full gap-2">
                <div className="flex items-center gap-2">
                    <img
                        src="/logo.png"
                        alt="logo"
                        className="w-10 h-10 cursor-pointer"
                        onClick={() => navigate('/instructor/dashboard')}
                    />
                </div>
                <div>
                    <div className="flex items-center gap-6">
                        {instructorLinks.map((link, index) => (
                            <Link
                                key={`${link.label}-${index}`}
                                to={link.to}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <ProfileDropDown />
            </div>
        </nav>
    );
};

export default InstructorNavbar;

