import React from 'react';
import { useFavorites } from '../hooks/useFavorites';
import FavoritesButton from '../components/FavoritesButton';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
	const { favorites, totalFavorites, clearFavorites } = useFavorites();

	if (totalFavorites === 0) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<div className='text-center'>
					<h1 className='text-2xl sm:text-3xl font-bold text-black mb-4'>
						Meus Favoritos
					</h1>
					<p className='text-gray-600 mb-8'>
						Você ainda não adicionou nenhum produto aos seus favoritos.
					</p>
					<Link
						to='/'
						className='bg-red1 text-white font-montserrat rounded px-6 py-3 hover:bg-red2 transition-colors duration-200 inline-block'
					>
						Ver Produtos
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Cabeçalho flexível: empilha em mobile (flex-col) e fica lado a lado em telas médias (sm:flex-row) */}
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
				<h1 className='text-2xl sm:text-3xl font-bold text-black'>
					Meus Favoritos
				</h1>

				<div className='flex items-center justify-between w-full sm:w-auto gap-4'>
					<span className='text-gray-600 text-sm sm:text-base'>
						{totalFavorites} produto{totalFavorites !== 1 ? 's' : ''}
					</span>
					<button
						onClick={clearFavorites}
						className='bg-red-500 text-white font-montserrat rounded px-4 py-2 hover:bg-red-600 transition-colors duration-200 text-sm sm:text-base'
						type='button'
					>
						Limpar Todos
					</button>
				</div>
			</div>

			{/* Grid ajustado */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
				{favorites.map(product => (
					<div
						key={product.id}
						className='flex flex-col bg-gra rounded-lg shadow p-4 relative h-full bg-graphite'
					>
						<div className='absolute top-2 right-2 z-10'>
							<FavoritesButton product={product} />
						</div>

						<img
							src={product.image}
							alt={product.name}
							className='w-full h-48 object-contain mb-4 rounded'
						/>

						<h3 className='font-montserrat font-bold text-white text-lg mb-2 line-clamp-2'>
							{product.name}
						</h3>

						<p className='text-sm text-white mb-3 line-clamp-3 leading-relaxed'>
							{product.description}
						</p>

						{/* mt-auto força o preço e o botão a ficarem sempre alinhados na base do card */}
						<div className='mt-auto'>
							<div className='font-montserrat font-bold text-xl text-white mb-4'>
								R$ {product.price.toFixed(2)}
							</div>

							<Link
								to={`/product/${product.id}`}
								className='block w-full bg-red1 text-white font-montserrat rounded px-4 py-2 hover:bg-red2 transition-colors duration-200 text-center'
							>
								Ver Detalhes
							</Link>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Favorites;
