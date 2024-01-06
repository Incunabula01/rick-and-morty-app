"use client";
import Image from 'next/image';
import { getEpisodes } from './api/episodes';
import { getAllCharacters, getCharData, getCharacters } from './api/characters';
import { useMemo, useState, useEffect, useRef } from 'react';
import Loading from './components/loading';
import {
  Episode,
  Character,
  EpisodeResult,
  CharResult,
  EpisodeMetadata,
  CharData
} from './utils/types';


export default function Home() {
  const [episodeList, setEpisodeList] = useState<EpisodeResult[]>([]);
  const [episodeMetadata, setEpisodeMetadata] = useState<EpisodeMetadata | null>(null);
  const [characterList, setCharacterList] = useState<CharResult[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState(false);
  const [page, setPage] = useState(1);

  const outerEl = useRef<HTMLDivElement>(null);
  const innerEl = useRef<HTMLDivElement>(null);

  useMemo(async () => {
    if (!episodeList.length) {
      setLoading(true);
      console.log('memo!!');

      const episodes: Episode | null = await getEpisodes();
      if (episodes) {
        setEpisodeList(episodes.data.results);
      }
      const allCharacters: CharData | null = await getAllCharacters();
      if (allCharacters) {
        setCharacterList(allCharacters.data.results);
        setLoading(false);
        console.log('allCharacters loading', loading);
      }

    }
    //eslint react-hooks/exhaustive-deps
  }, [episodeList.length]);

  const handleEpisodeSelect = async (id: number) => {
    if (id === selected) {
      setSelected(null);
      setEpisodeMetadata(null);
      const allCharacters: CharData | null = await getAllCharacters();
      if (allCharacters) {
        setCharacterList(allCharacters.data.results);
      }
      setDisableInfiniteScroll(false);
      setPage(1);
      return;
    }
    setDisableInfiniteScroll(true);
    setLoading(true);
    const filterEp = episodeList.filter(ep => ep.id === id);
    const { name, characters } = filterEp[0];
    setEpisodeMetadata({
      name, charCount: characters.length
    });

    const characterArray: string[] = characters.map(char => {
      const getCharId = char.split('/');
      return getCharId[getCharId.length - 1]
    });

    const getChar: Character | null = await getCharacters({ chars: characterArray });

    if (getChar) {
      setLoading(false);
      setCharacterList(getChar.data);
      setSelected(id);
    }
  }

  useEffect(() => {
    const fetchData = async () => {

      if (page > 1) {
        console.log('fetchData!');

        setLoading(true);
        const allCharacters: CharData | null = await getCharData({ pageNum: page.toString() });
        if (allCharacters && !allCharacters?.data.hasOwnProperty('error')) {
          const newCharacters = allCharacters.data.results;
          setCharacterList((prevCharacters) => [...prevCharacters, ...newCharacters]);
          console.log('new characters set, page ==>', page);

          setLoading(false);
        } else {
          setLoading(false);
          setDisableInfiniteScroll(true);
        }
      }
    };
    fetchData();
  }, [page]);


  useEffect(() => {

    if (disableInfiniteScroll) return;

    const outerElement = outerEl.current;
    const handleScroll = () => {

      if (outerElement) {
        const { scrollHeight, clientHeight, scrollTop } = outerElement;

        if (scrollHeight - scrollTop !== clientHeight) {
          return;
        }

        console.log('isLoading?', loading);
        console.log('fetch data trigger', scrollHeight - scrollTop !== clientHeight, loading);

        setPage(page + 1);
        console.log('set page ===>', page);
      }

    };

    if (outerElement) {
      outerElement.addEventListener('scroll', handleScroll);
      console.log('scroller added!');
      return () => {
        console.log('scroller removed!');
        outerElement.removeEventListener('scroll', handleScroll);
      }
    }

  }, [page, disableInfiniteScroll]);

  return (
    <>
      <header className='p-4 flex flex-col justify-center items-center'>
        <h1 className='text-6xl text-rmGreen'>Rick and Morty Characters</h1>
      </header>
      <main className="container mx-auto flex min-h-screen flex-row items-start justify-between px-4 space-x-3">
        <div className="flex flex-col items-center justify-center bg-rmYellow rounded-[2rem] border-rmTeal border-4 w-1/4 p-4">
          <h2 className='text-2xl text-rmTeal'>Episode List</h2>
          <hr className='w-full m-3 border-rmTeal' />

          <div className='max-h-[70vh] overflow-y-scroll'>
            {episodeList ?
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
        <div className="relative w-3/4">
          {characterList &&
            <>
              <div className="max-h-[85vh] overflow-y-scroll" ref={outerEl}>


                <div className="relative z-10">
                  {episodeMetadata &&
                    <div className='pb-2 w-full border-b-2 border-rmTeal mb-2'>
                      <p className='font-semibold text-rmTeal'>{`${episodeMetadata.charCount} Characters in episode "${episodeMetadata.name}"`}</p>
                    </div>
                  }

                  <div className='grid grid-cols-5 grid-rows-4 space-x-2 space-y-2' ref={innerEl}>
                    {characterList.map(char => (
                      <div key={char.id} className='flex flex-col items-center first:mt-2 first:ml-3'>
                        <div className='rounded-3xl border-rmYellow border-4 overflow-hidden w-full h-[200px]'>
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
                </div>



              </div>
              {loading && <Loading />}
            </>
          }
          {loading && !characterList &&
            <div className="h-[85vh] flex justify-center items-center">
              <Loading />
            </div>
          }
        </div>



      </main>
    </>

  )
}
