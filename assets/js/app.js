/* 
    1. Render songs
    2. Scroll top
    3. Play/ pause/ seek
    4. CD rotated
    5. Next/ prev 
    6. Random
    7. Next/ Repeat when ended
    8. Active song
    9. Scroll active song into view
    10. Play song when click
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $('.player')
const heading = $('header h2')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const playlist = $(".playlist");


const app = {
    // (1/2) Uncomment the line below to use localStorage
    // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},

    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {
        isRepeat: false,
        isRandom: false
    },
    // arrIndexRandomSongs: [],
    songs: [
    {
        name: "Có Chắc Yêu Là Đây",
        singer: "Sơn Tùng M-TP,Onionn",
        path: "./assets/audio/CoChacYeuLaDayOnionnRemix-SonTungMTPOnionn-7022615.mp3",
        image: "https://avatar-nct.nixcdn.com/singer/avatar/2021/05/12/7/d/c/b/1620802736418.jpg"
    },
    {
        name: "Độ tộc 2",
        singer: "Masew,  Pháo,Phúc Du, Phùng Thanh Độ",
        path: "./assets/audio/DoToc2-MasewDoMixiPhucDuPhao-7064730.mp3",
        image:
        "https://avatar-nct.nixcdn.com/song/2021/08/08/f/a/f/b/1628385536495.jpg"
    },
    {
        name: "Sài Gòn Đau Lòng Quá",
        singer: "Hứa Kim Tuyền,Hoàng Duyên",
        path:
        "./assets/audio/SaiGonDauLongQua-HuaKimTuyenHoangDuyen-6992977.mp3",
        image: "https://avatar-nct.nixcdn.com/song/2021/03/27/d/2/9/1/1616859493571.jpg"
    },
    {
        name: "Thức Giấc",
        singer: "Da LAB",
        path: "./assets/audio/ThucGiac-DaLAB-7048212.mp3",
        image: "https://avatar-nct.nixcdn.com/song/2021/07/14/8/c/f/9/1626231010810.jpg"
    },
    {
        name: "Trốn Tìm",
        singer: "Đen Vâu x MTV Band",
        path: "./assets/audio/Tron Tim - Den_ MTV Band.mp3",
        image:
        "https://data.chiasenhac.com/data/cover/141/140366.jpg"
    },
    {
        name: "Feeling You",
        singer: "Raftaar x Harjas",
        path: "./assets/audio/Feelingyou-Tiffany_mns8.mp3",
        image:
        "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
    }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
        return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}" >
            <div class="thumb" 
            style="background-image: url('${song.image}')">
            </div>
            <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <di class="option">
            <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        `
        })

        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
        
    },
    handleEvents: function() {  
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay/ dừng
        const cdThumbAnimate = cdThumb.animate({
            transform: 'rotate(360deg)'
        },{
            duration: 16000,
            iterations: Infinity 
        })

        cdThumbAnimate.pause()

        // Xử lý phóng to/ thu nhỏ CD
        document.onscroll = function() {
        scrollTop = window.scrollY || document.documentElement.scrollTop
        const newCdWidth = cdWidth - scrollTop

        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        cd.style.opacity = newCdWidth / cdWidth 
        }

        // Xử lý khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }           
        }

        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(100 * audio.currentTime / audio.duration)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.onchange = function(e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActivesong()
        }

        // Khi prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActivesong()
        }

        // Xử lý bật/tắt random song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom',_this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý lặp lại song
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat',_this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào song option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    loadCurrentSong: function() {
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex ++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex --
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1 
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        // this.arrIndexRandomSongs.push(this.currentIndex)
        // if (this.arrIndexRandomSongs.length === this.songs.length) {
        //     arrIndexRandomSongs = []
        // }

        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(this.currentIndex === newIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActivesong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behaviors: 'smooth',
                block: 'nearest'
            })
        }, 200)
    },
    start: function() {
        // Gán cấu hình từ config vào app
        this.loadConfig()

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
};

app.start();
