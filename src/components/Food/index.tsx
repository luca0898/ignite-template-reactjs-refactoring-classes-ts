import { useState } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';
import api from '../../services/api';
import { Container } from './styles';

interface Food {
  id?: number;
  name: string;
  image: string;
  price: number;
  available: boolean;
  description: string;
}

interface FoodProps {
  food: Food;

  handleEditFood: (food: Food) => void;
  handleDelete: (id: number) => void;
}

const Food: React.FC<FoodProps> = ({ food, handleEditFood, handleDelete }) => {
  const [isAvailable, setIsAvailable] = useState(false)

  const toggleAvailable = async () => {
    await api.put(`/foods/${food.id}`, food);

    setIsAvailable(!isAvailable);
  }

  const setEditingFood = () => {
    handleEditFood(food);
  }

  return (
    <Container available={isAvailable}>
      <header>
        <img src={food.image} alt={food.name} />
      </header>
      <section className="body">
        <h2>{food.name}</h2>
        <p>{food.description}</p>
        <p className="price">
          R$ <b>{food.price}</b>
        </p>
      </section>
      <section className="footer">
        <div className="icon-container">
          <button
            type="button"
            className="icon"
            onClick={setEditingFood}
            data-testid={`edit-food-${food.id}`}
          >
            <FiEdit3 size={20} />
          </button>

          <button
            type="button"
            className="icon"
            onClick={() => handleDelete(food.id || 0)}
            data-testid={`remove-food-${food.id}`}
          >
            <FiTrash size={20} />
          </button>
        </div>

        <div className="availability-container">
          <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

          <label htmlFor={`available-switch-${food.id}`} className="switch">
            <input
              id={`available-switch-${food.id}`}
              type="checkbox"
              checked={isAvailable}
              onChange={toggleAvailable}
              data-testid={`change-status-food-${food.id}`}
            />
            <span className="slider" />
          </label>
        </div>
      </section>
    </Container>
  );
}

export default Food;
