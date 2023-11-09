"use client";
import Image from 'next/image';
import { getEpisodes } from './api/episodes';
import { getAllCharacters, getCharacters } from './api/characters';
import { useMemo,  useState } from 'react';
import Loading from './components/loading';
import {
  Episode,
  Character,
  EpisodeResult,
  CharResult,
} from './utils/types';

export default function Home() {
  const [episodeList, setEpisodeList] = useState<EpisodeResult[]>([]);
  const [episodeMetadata, setEpisodeMetadata] = useState<EpisodeMetadata | null>(null);
  const [characterList, setCharacterList] = useState<CharResult[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  useMemo(async () => {
    if(!episodeList.length){
      setLoading(true);
      const episodes: Episode | null = await getEpisodes();
      if (episodes){
        setEpisodeList(episodes.data.results);
        setLoading(false);
      }
      const allCharacters: Character | null = await getAllCharacters();
      if(allCharacters){
        setCharacterList(allCharacters.data.results);
        setLoading(false);
      }
    }
    //eslint react-hooks/exhaustive-deps
  }, []);

  const handleEpisodeSelect = async (id: number) => {
    if(id === selected){
      setSelected(null);
      setEpisodeMetadata(null);
      const allCharacters = await getAllCharacters();
      if (allCharacters) {
        setCharacterList(allCharacters.data.results);
      }
      return;
    }
    setLoading(true);
    const filterEp = episodeList.filter(ep => ep.id === id);
    const { name, characters } = filterEp[0];
    setEpisodeMetadata({
      name, charCount: characters.length
    });

    const characterArray: any[] = characters.map(char => {
      const getCharId = char.split('/');
      return getCharId[getCharId.length - 1]
    });
    
    const getChar: Character | null = await getCharacters({ chars: characterArray });

    if (getChar){
      setLoading(false);
      setCharacterList(getChar.data.results);
      setSelected(id);
    }
  }

  return (
    <>
      <header className='p-4 flex flex-col justify-center items-center'>
        <h1 className='text-6xl text-rmGreen'>Rick and Morty Characters</h1>
      </header>
      <main className="container mx-auto flex min-h-screen flex-row items-start justify-between px-4 space-x-3">
        <div className="flex flex-col items-center justify-center bg-rmYellow rounded-[2rem] border-rmTeal border-4 w-1/4 p-4">
          <h2 className='text-2xl text-rmTeal'>Episode List</h2>
          <hr className='w-full m-3 border-rmTeal'/>
          
            <div className='max-h-[70vh] overflow-y-scroll'>
                { episodeList ? 
                      <ul className='space-y-3'>
                          {episodeList.map(episode => (
                            <li key={episode.id} onClick={() => handleEpisodeSelect(episode.id)}>
                              <div className={`${selected === episode.id ? 'border-rmTeal bg-rmPink' : 'border-rmTeal'} bg-rmGreen rounded-md border-4 cursor-pointer p-2 hover:bg-rmTeal`}>
                                <p className='font-semibold text-rmYellow'>{episode.name}</p>
                              </div>

                            </li>
                          ))}
                      </ul>
                    :
                    <div className='p-4 flex flex-col justify-center items-center'>
                      <p className='font-semibold'>No Episodes Available</p>
                    </div>
                }
            </div>
           
        </div>
        <div className="w-3/4  overflow-y-scroll">
          <div>
            {loading && <Loading />}
            {characterList  && 
                <>
                  {episodeMetadata && 
                    <div className='pb-2 w-full border-b-2 border-rmTeal mb-2'>
                      <p className='font-semibold text-rmTeal'>{`${episodeMetadata.charCount} Characters in episode "${episodeMetadata.name}"`}</p>
                    </div>
                  }
                 
                  <div className='grid grid-cols-5 grid-rows-4 space-x-2 space-y-3'>
                    {characterList.map(char => (
                      <div className='flex flex-col items-center first:mt-3 first:ml-3'>
                        <div className='rounded-3xl border-rmYellow border-4 overflow-hidden w-full h-[200px] ' key={char.id}>
                          <div className="w-full h-full relative">
                            <Image
                              src={char.image}
                              alt={char.name}
                              className="absolute inset-[0px_0px_1rem_0px] w-full h-full object-cover object-center"
                              layout="fill"
                            />
                          </div>


                        </div>
                        <div className="p-2">
                          <p className='font-semibold  text-rmTeal leading-4'>{char.name}</p>
                        </div>
                      </div>
                      
                    ))}
                  </div>
                </>
                 
             }
            </div>
        </div>
      </main>
    </>
    
  )
}
