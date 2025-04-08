import Layout from '@/Components/ui/layout';
import axios from 'axios';

const DeepSeekTest = () => {
  const handleSubmit = async () => {
    try {
      const response = await axios.get('/admin/chat/send');
      if (response.data.success) {
        console.log('Response:', response.data.message);
        alert(response.data.message);
      } else {
        alert('Error: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error invoking DeepSeekController:', error);
      alert('Failed to invoke DeepSeekController. ' + error);
    }
  };

  return (
    <Layout>
      <div>
        <button onClick={handleSubmit}>Invoke DeepSeekController</button>
      </div>
    </Layout>
  );
};

export default DeepSeekTest;