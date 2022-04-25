import { appConfig } from "../app/Config"

const config = {
    screens: {
        RootMain: {
            path: 'app',
            screens: {
                Root: {
                    path: 'root',

                    screens: {

                        /// Khai báo chức năng chính ở đây 

                        JeeNew: {
                            path: "jeenew",
                            screens: {

                                ManHinh_CongViecCaNhan: {
                                    path: "CongViecCaNhan",
                                    screens: {
                                        sc_ChiTietCongViecCaNhan: {
                                            path: "ChiTietCVCaNhan/:id_row"
                                        },
                                    }
                                },
                                sc_QuaHan: {
                                    path: "CVQuaHan",
                                },
                                sc_CVHetHanTrongNgay: {
                                    path: "CVHetHanTrongNgay"
                                },
                                sc_GiaoViec: {
                                    path: "GiaoViec",
                                },
                                sc_JeeWorkFlow: {
                                    path: "JeeWorkFlow",
                                    screens: {
                                        sc_ChiTietCongViecQuyTrinh: {
                                            path: "ChiTietQuyTrinh/:taskid/:stageid"
                                        }
                                    }
                                },
                                sc_QuanLyDuAn: {
                                    path: "QuanLyDuAn",
                                    screens: {
                                        sc_ChiTietDuAn: {
                                            path: "ChiTietDuAn/:id_row"
                                        }
                                    }
                                },

                                sc_ViecNhanVIenCapDuoi: {
                                    path: "ViecNhanVienCapDuoi"
                                },

                                sc_CongViecTheoDoi: {
                                    path: "CongViecTheoDoi"
                                },



                                sc_NghiPhep: {
                                    path: "CN_guidonxinnghiphep",
                                    screens: {
                                        Modal_ChiTietNghiPhep: {
                                            path: "ctPhep/:itemId"
                                        },
                                    },
                                },

                                sc_TangCa: {
                                    path: "TangCa",
                                    screens: {
                                        DetailsDoiCa: {
                                            path: "cttangca/:itemId"
                                        },
                                    },
                                },

                                // sc_DoiCaLamViec: {
                                //     path: "DoiCaLamViec",
                                //     screen: {
                                sc_ChiTietDoiCaLV: {
                                    path: "ctdoicalv/:RowID"
                                    // }
                                },
                                // },
                                sc_BangChamCong: {
                                    path: "BangChamCong"
                                },

                                sc_BangLuongChiTiet: {
                                    path: "BangLuongChiTiet"
                                },

                                sc_QuanLyNhanVien: {
                                    path: "QuanLyNhanVien"
                                },

                                sc_PhepTonNhanVien: {
                                    path: "PhepTonNhanVien"
                                },

                                sc_GTChamCong: {
                                    path: "GTChamCong",
                                    screens: {
                                        sc_ChiTietGiaiTrinh: {
                                            path: "chitietgiaitrinh/:RowID",
                                        }
                                    }
                                },

                                sc_QuanLyChamCong: {
                                    path: "QuanLyChamCong"
                                },

                                sc_QuanLyDuyet: {
                                    path: "QuanLyDuyet"
                                },

                                sc_GuiYeuCau: {
                                    path: "GuiYeuCau",
                                    screens: {
                                        sc_ChiTietYeuCau: {
                                            path: "ChiTietGuiYeuCau/:rowid"
                                        },
                                    }
                                },

                                sc_DuyetYeuCau: {
                                    path: "DuyetYeuCau",
                                    screens: {
                                        sc_ChiTietYeuCau: {
                                            path: "ChiTietDuyetYeuCau/:rowid"
                                        },
                                    }

                                },

                                sc_CaiDatYeuCau: {
                                    path: "CaiDatYeuCau"
                                },

                                // sc_chitietDuyetDoiCa: {
                                //     path: "ChiTietDuyetDoiCa/:itemId"
                                // },
                                // sc_ChiTietDuyetGiaiTrinh: {
                                //     path: "ChiTietDuyetGiaiTrinh/:itemId"
                                // },
                                // sc_CTDuyetPhep: {
                                //     path: "ctDuyetPhep/:itemId"
                                // },

                                // sc_CTDuyetTangCa: {
                                //     path: "ctDuyetTangCa/:itemId"
                                // },
                                sc_QuanLyDuyetNotifi: {
                                    path: 'homeduyet',
                                    screens: {
                                        sc_chitietDuyetDoiCa: {
                                            path: "ChiTietDuyetDoiCa/:RowID"
                                        },
                                        sc_ChiTietDuyetGiaiTrinh: {
                                            path: "ChiTietDuyetGiaiTrinh/:itemId"
                                        },
                                        sc_CTDuyetPhep: {
                                            path: "ctDuyetPhep/:itemId"
                                        },

                                        sc_CTDuyetTangCa: {
                                            path: "ctDuyetTangCa/:itemId"
                                        },
                                        sc_ChiTietThoiViec: {
                                            path: 'ctDuyetThoiViec/:RowID'
                                        }
                                    }
                                },

                                sc_ChiTietSocail: {
                                    path: "ChiTietSocialNoti/:idbaidang"
                                },
                                sc_Information: {
                                    path: "ThongTinNhanVien",
                                    screens: {
                                        sc_ThoiViec: {
                                            path: 'ctThoiViec'
                                        }
                                    }
                                },
                                sc_HomeCuocHop: {
                                    path: 'homecuochop',
                                    screens: {
                                        sc_ChiTietCuocHopTouch: {
                                            path: 'ctcuochop/:rowid'
                                        }
                                    }
                                },
                                sc_Chat: {
                                    path: 'chat',
                                    screens: {
                                        ChatMessCopy: {
                                            path: 'message/:IdGroup/:IdChat'
                                        }
                                    }
                                },
                                sc_JeeHanhChanh: {
                                    path: 'dktaisan',
                                    screens: {
                                        chitiet_ts: {
                                            path: 'chitiet_ts/:requestid'
                                        }
                                    }
                                },
                                sc_JeeHanhChanhAdmin: {
                                    path: 'qltaisan',
                                    screens: {
                                        chitiet_Admin: {
                                            path: 'chitiet_Admin/:requestid'
                                        }
                                    }
                                },


                                sw_HomePage: {
                                    path: "HomePage",

                                    screens: {
                                        tab_Social: {
                                            path: "HomeSocial",
                                            screens: {
                                                // Modal_ChiTietSocailNoti: {
                                                //     path: "ChiTietSocialNoti/:idbaidang"
                                                // }
                                            }
                                        },
                                        tab_Noti: {
                                            path: "Noti",
                                            screens: {
                                                Modal_ChiTietThongBao: {
                                                    path: "ctThongbaoNhanSu/:rowid"
                                                },
                                            }
                                        },

                                        tab_Home: {
                                            path: "Home"
                                        },

                                        tab_Mesage: {
                                            path: "Message"
                                        },

                                        tab_Setting: {
                                            path: "Setting"
                                        },

                                    }
                                },
                            }
                        },
                    }
                }
            }
        }

    },
}



const Linking = {
    prefixes: [`${appConfig.appDevLink}`],
    config: config,
}

export default Linking