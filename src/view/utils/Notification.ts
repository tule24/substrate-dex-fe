import {notification} from 'antd'
type NotificationType = 'success' | 'info' | 'warning' | 'error';

const openNotification = (type: NotificationType, message: String, description: String) => {
    switch (type) {
        case 'success': {
            notification.success({
                message,
                description,
                duration: 3
            });
            break;
        }
        case 'error': {
            notification.error({
                message,
                description,
                duration: 3
            });
            break;
        }
        case 'warning': {
            notification.warning({
                message,
                description,
                duration: 3
            });
            break;
        }
        case 'info': {
            notification.info({
                message,
                description,
                duration: 3
            });
            break;
        }
    }
};

export default openNotification